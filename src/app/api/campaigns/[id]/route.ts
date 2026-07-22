import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .select("*, user:profiles!campaigns_user_id_fkey(display_name, avatar, bio, location, website, social_links), category:categories(name, slug, icon)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    await supabase
      .from("campaigns")
      .update({ view_count: (data.view_count ?? 0) + 1 })
      .eq("id", id);

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const admin = createAdminClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: campaign, error: fetchError } = await admin
      .from("campaigns")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.user_id !== user.id) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { data: userData } = await admin.auth.admin.getUserById(user.id);
      if (userData.user?.app_metadata?.role !== "admin" && (!profile || profile.id !== user.id)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const allowedFields: Record<string, string> = {};
    const fieldMap: Record<string, string> = {
      title: "title",
      shortDescription: "short_description",
      fullStory: "full_story",
      goal: "goal",
      coverImage: "cover_image",
      galleryImages: "gallery_images",
      videoUrl: "video_url",
      deadline: "deadline",
      tags: "tags",
    };

    for (const [key, dbCol] of Object.entries(fieldMap)) {
      if (key in body) {
        allowedFields[dbCol] = body[key];
      }
    }

    allowedFields.updated_at = new Date().toISOString();

    const { data: updated, error: updateError } = await admin
      .from("campaigns")
      .update(allowedFields)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: campaign, error: fetchError } = await admin
      .from("campaigns")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const { data: userData } = await admin.auth.admin.getUserById(user.id);
    const isAdmin = userData.user?.app_metadata?.role === "admin";

    if (campaign.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: deleteError } = await admin.from("campaigns").delete().eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
