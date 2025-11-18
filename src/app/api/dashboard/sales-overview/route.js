import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all fully active users with their country and earnings
    const fullyActiveUsers = await User.find({ 
      status: "fully_active" 
    }).select("address.country earnings");

    // Banned countries list
    const bannedCountries = [
      "pakistan", "somalia", "sudan", 
      "democratic republic of congo", "democratic republic of the congo",
      "congo", "yemen"
    ];
    
    // Group by country and calculate totals
    const salesByCountry = {};
    
    fullyActiveUsers.forEach(user => {
      const country = user.address?.country?.toLowerCase();
      const earnings = user.earnings?.total || 0;
      
      // Skip if no country data or banned country
      if (!country || country === "" || country === "unknown" || 
          bannedCountries.includes(country)) {
        return;
      }
      
      if (!salesByCountry[country]) {
        salesByCountry[country] = {
          country: country,
          value: 0,
          salesCount: 0
        };
      }
      
      salesByCountry[country].value += earnings;
      salesByCountry[country].salesCount += 1;
    });

    // Country name to ISO code mapping for WorldMap
    const countryToISO = {
      "united states": "US",
      "canada": "CA",
      "united kingdom": "GB",
      "australia": "AU",
      "germany": "DE",
      "france": "FR",
      "italy": "IT",
      "spain": "ES",
      "netherlands": "NL",
      "sweden": "SE",
      "norway": "NO",
      "denmark": "DK",
      "finland": "FI",
      "switzerland": "CH",
      "austria": "AT",
      "belgium": "BE",
      "portugal": "PT",
      "india": "IN",
      "bangladesh": "BD",
      "japan": "JP",
      "south korea": "KR",
      "china": "CN",
      "brazil": "BR",
      "mexico": "MX",
      "argentina": "AR",
      "chile": "CL",
      "colombia": "CO",
      "peru": "PE",
      "south africa": "ZA",
      "nigeria": "NG",
      "kenya": "KE",
      "egypt": "EG",
      "morocco": "MA",
      "ghana": "GH"
    };
    
    // All countries with their ISO codes (including zero values)
    const allCountries = {
      "US": 0, "CA": 0, "GB": 0, "AU": 0, "DE": 0, "FR": 0, "IT": 0, "ES": 0,
      "NL": 0, "SE": 0, "NO": 0, "DK": 0, "FI": 0, "CH": 0, "AT": 0, "BE": 0,
      "PT": 0, "IN": 0, "BD": 0, "JP": 0, "KR": 0, "CN": 0, "BR": 0, "MX": 0,
      "AR": 0, "CL": 0, "CO": 0, "PE": 0, "ZA": 0, "NG": 0, "KE": 0, "EG": 0,
      "MA": 0, "GH": 0
    };
    
    // Update with actual sales data
    Object.values(salesByCountry).forEach(country => {
      const isoCode = countryToISO[country.country];
      if (isoCode && allCountries.hasOwnProperty(isoCode)) {
        allCountries[isoCode] = country.value;
      }
    });
    
    // Convert to array format for WorldMap
    const mapData = Object.entries(allCountries).map(([country, value]) => ({
      country,
      value
    }));
    
    // Function to format country names properly
    const formatCountryName = (country) => {
      return country.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    // Get top 3 markets from original salesByCountry data
    const topMarkets = Object.values(salesByCountry)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(market => ({
        name: formatCountryName(market.country),
        value: `$${(market.value / 1000).toFixed(1)}k`,
        salesCount: market.salesCount
      }));

    return NextResponse.json({
      mapData,
      topMarkets,
      totalSales: fullyActiveUsers.length,
      totalEarnings: mapData.reduce((sum, market) => sum + market.value, 0)
    });

  } catch (error) {
    console.error("Sales overview error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}