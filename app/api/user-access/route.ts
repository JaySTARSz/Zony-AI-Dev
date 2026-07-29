import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.whop.com/api/v1/members/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Whop API error: ${response.status}` },
        { status: response.status }
      );
    }

    const memberData = await response.json();
    
    // Extract memberships and check status
    const memberships = memberData.memberships || [];
    const hasGameDev = memberships.some(
      (m) => m.product_id === 'prod_2NCaLmIX3miCc' && 
             ['active', 'trialing', 'completed', 'past_due'].includes(m.status)
    );
    const hasVideoGen = memberships.some(
      (m) => m.product_id === 'prod_rvBtXBKVYH9wR' && 
             ['active', 'trialing', 'completed', 'past_due'].includes(m.status)
    );

    return NextResponse.json({
      userId,
      hasGameDev,
      hasVideoGen,
      memberships,
    });
  } catch (error) {
    console.error('Error fetching user access:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user access' },
      { status: 500 }
    );
  }
}
