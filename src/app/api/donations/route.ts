import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { donationFormSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const campaignId = searchParams.get("campaignId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("donations")
      .select("*, campaign:campaigns(id, title, slug, cover_image)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize: limit,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();
    const body = await request.json();

    const parsed = donationFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { amount, currency, paymentMethod, anonymous, message, donorName, donorEmail } =
      parsed.data;

    const campaignId = body.campaignId as string | undefined;
    if (!campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
    }

    const { data: campaign, error: campaignError } = await admin
      .from("campaigns")
      .select("id, user_id, status")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status !== "active") {
      return NextResponse.json(
        { error: "Campaign is not accepting donations" },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: donation, error: donationError } = await admin
      .from("donations")
      .insert({
        campaign_id: campaignId,
        user_id: user?.id ?? null,
        amount,
        currency,
        payment_method: paymentMethod,
        payment_status: "pending",
        anonymous,
        message: message ?? null,
        donor_name: donorName ?? null,
        donor_email: donorEmail ?? null,
      })
      .select()
      .single();

    if (donationError) {
      return NextResponse.json({ error: donationError.message }, { status: 500 });
    }

    const reference = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const { error: txError } = await admin.from("payment_transactions").insert({
      donation_id: donation.id,
      campaign_id: campaignId,
      amount,
      fee: 0,
      net_amount: amount,
      gateway: paymentMethod,
      status: "pending",
      reference,
    });

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 500 });
    }

    if (user) {
      await admin.from("notifications").insert({
        user_id: campaign.user_id,
        type: "donation",
        title: "New Donation",
        message: `Your campaign received a ${currency} ${amount} donation.`,
        link: `/campaigns/${campaignId}`,
      });
    }

    return NextResponse.json({ data: donation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
