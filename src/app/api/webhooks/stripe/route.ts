import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const admin = createAdminClient();

      const donationId = session.metadata?.donation_id;
      const campaignId = session.metadata?.campaign_id;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      if (donationId && campaignId) {
        await admin
          .from("donations")
          .update({ payment_status: "completed", transaction_id: session.payment_intent as string })
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
            message: `A $${amount} donation was completed for your campaign.`,
            link: `/campaigns/${campaignId}`,
          });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
