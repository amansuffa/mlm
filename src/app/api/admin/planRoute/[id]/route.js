import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Plan from '@/models/Plan';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const planId = params.id;

    const updatedPlan = await Plan.findByIdAndUpdate(planId, body, { new: true });
    if (!updatedPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, plan: updatedPlan }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update plan', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const planId = params.id;
    const deletedPlan = await Plan.findByIdAndDelete(planId);
    if (!deletedPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Plan deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete plan', details: error.message }, { status: 500 });
  }
}
