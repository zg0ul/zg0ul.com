/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminAPIAuth,
  createUnauthorizedResponse,
} from "@/lib/admin-api-auth";

type Params = Promise<{ id: string }>;

// GET handler to fetch a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Unexpected error in GET /api/projects/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: 500 },
    );
  }
}

// PUT handler to update a specific project
export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    // Check admin authentication first
    if (!(await checkAdminAPIAuth())) {
      return createUnauthorizedResponse();
    }

    // Get the project ID from the URL params - properly handled without destructuring
    const { id } = await params;

    // Parse the request body
    const body = await request.json();

    // Initialize Supabase client with admin privileges
    const supabase = createAdminClient();

    // Update the project in the database
    const { data, error } = await supabase
      .from("projects")
      .update(body)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating project:", error);
      return NextResponse.json(
        { error: `Error updating project: ${error.message}` },
        { status: 500 },
      );
    }

    // Return the updated data, but ensure we handle empty results correctly
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Project not found or no changes made" },
        { status: 404 },
      );
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("Unexpected error in PUT /api/projects/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE handler to remove a specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    // Check admin authentication first
    if (!(await checkAdminAPIAuth())) {
      return createUnauthorizedResponse();
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return NextResponse.json(
        { error: `Error deleting project: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/projects/[id]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
