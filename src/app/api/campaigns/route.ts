import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { campaignFormSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("campaigns")
      .select(
        "*, user:profiles!campaigns_user_id_fkey(display_name, avatar), category:categories(name, slug, icon)",
        { count: "exact" }
      )
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category_id", category);
    }

    if (status) {
      query = query.eq("status", status);
    } else {
      query = query.eq("status", "active");
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    switch (sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "most_funded":
        query = query.order("raised", { ascending: false });
        break;
      case "ending_soon":
        query = query.order("deadline", { ascending: true });
        break;
      case "most_popular":
        query = query.order("donor_count", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = campaignFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    let categoryId: string | null = null;
    if (data.categoryId) {
      categoryId = data.categoryId;
    } else if (data.category) {
      const { data: categoryRow } = await admin
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .single();
      categoryId = categoryRow?.id ?? null;
    }

    const beneficiaryMap: Record<string, string> = {
      myself: "self",
      friend: "someone_else",
      charity: "charity",
      business: "someone_else",
      other: "someone_else",
    };
    const beneficiaryType =
      beneficiaryMap[data.beneficiaryType] ?? data.beneficiaryType;

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const isAdmin =
      authUser &&
      (await admin.auth.admin.getUserById(authUser.id)).data.user?.app_metadata
        ?.role === "admin";

    let slug = slugify(data.title);

    const { data: existing } = await admin
      .from("campaigns")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const { data: campaign, error: insertError } = await admin
      .from("campaigns")
      .insert({
        user_id: user.id,
        slug,
        title: data.title,
        short_description: data.shortDescription,
        full_story: data.fullStory,
        goal: data.goal,
        raised: 0,
        currency: data.currency,
        category_id: categoryId,
        country: data.country,
        beneficiary_type: beneficiaryType,
        beneficiary_name: data.beneficiaryName,
        cover_image: data.coverImage,
        gallery_images: data.galleryImages ?? [],
        video_url: data.videoUrl ?? null,
        deadline: data.deadline,
        status: isAdmin && data.status ? data.status : "pending",
        tags: data.tags ?? [],
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
