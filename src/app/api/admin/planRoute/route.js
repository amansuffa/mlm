import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Plan from '@/models/Plan';

// GET - All plans fetch karega
export async function GET() {
  try {
    await connectDB();
    
    const plans = await Plan.find({}).sort({ price: 1 });
    
    console.log('Fetched plans:', plans.length);
    
    return NextResponse.json({
      success: true,
      count: plans.length,
      plans: plans
    });
    
  } catch (error) {
    console.error('Error fetching plans:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch plans',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - New plan create karega
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Received plan data:', body); 

    if (!body.name) {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    if (!body.price || body.price < 0) {
      return NextResponse.json(
        { error: 'Valid plan price is required' },
        { status: 400 }
      );
    }

    const newPlan = new Plan({
      name: body.name,
      price: body.price,
      duration: body.duration || 'per month',
      features: body.features || [],
      popular: body.popular || false,
      color: body.color || 'blue',
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    const savedPlan = await newPlan.save();
    
    console.log('Plan saved successfully:', savedPlan);

    return NextResponse.json(
      { 
        success: true,
        message: 'Plan created successfully',
        plan: savedPlan 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating plan:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create plan',
        details: error.message 
      },
      { status: 500 }
    );
  }
}