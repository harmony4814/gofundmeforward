import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const admin = createAdminClient();

      const resourceId = body.resource?.id;
      const customId = body.resource?.custom_id;

      if (!customId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const parts = customId.split(":");
      const donationId = parts[0];
      const campaignId = parts[1];

      if (!donationId || !campaignId) {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const { data: donation } = await admin
        .from("donations")
        .select("amount")
        .eq("id", donationId)
        .single();

      const amount = donation?.amount ?? 0;

      await admin
        .from("donations")
        .update({ payment_status: "completed", transaction_id: resourceId })
        .eq("id", donationId);

      await admin
        .from("payment_transactions")
        .update({ status: "completed" })
        .eq("donation_id", donationId);

      const { data: campaign } = await admin
        .from("campaigns")
        .select("raised, donor_count, user_id")
        .eq("id", campaignId)
        .single();

      if (campaign) {
        await admin
          .from("campaigns")
          .update({
            raised: (campaign.raised ?? 0) + amount,
            donor_count: (campaign.donor_count ?? 0) + 1,
          })
          .eq("id", campaignId);

        await admin.from("notifications").insert({
          user_id: campaign.user_id,
          type: "donation",
          title: "Donation Received",
          message: `A $${amount} PayPal donation was completed for your campaign.`,
          link: `/campaigns/${campaignId}`,
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
