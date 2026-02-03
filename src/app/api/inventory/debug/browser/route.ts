
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path'); // optional manual override
  
  const client = Client.init({
    authProvider: (done) => {
      done(null, session.accessToken as string);
    },
  });

  try {
    // If manual path exploration is requested
    if (path) {
        // ... (keep existing manual logic if needed, or just simplify)
        // For now, let's just do the smart auto-discovery unless ?mode=manual
    }

    const report: any = { steps: [] };

    // 1. Resolve Site
    report.steps.push("Resolving Site 'BCSRIF'...");
    let site;
    try {
        site = await client.api('/sites/gounbc.sharepoint.com:/sites/BCSRIF').get();
        report.site = site;
        report.steps.push(`✅ Found Site: ${site.displayName} (${site.id})`);
    } catch (e) {
        report.steps.push("❌ Could not resolve site '/sites/BCSRIF'. Listing joined teams instead...");
        const teams = await client.api('/me/joinedTeams').get();
        return NextResponse.json({ report, teams: teams.value, message: "Could not find BCSRIF site. Please check joined teams." });
    }

    // 2. Resolve Drive
    report.steps.push("Listing Drives...");
    const drives = await client.api(`/sites/${site.id}/drives`).get();
    const defaultDrive = drives.value[0]; // Usually "Documents"
    report.drive = defaultDrive;
    report.steps.push(`✅ Using Drive: ${defaultDrive.name} (${defaultDrive.id})`);

    // 3. Search for File
    // We look for '01_Metabase' folder or just the file if we can search
    report.steps.push("Searching for 'Equipment.xlsx' or '01_Metabase'...");
    
    // Search query
    const searchRes = await client.api(`/sites/${site.id}/drives/${defaultDrive.id}/root/search(q='Equipment')`).get();
    const equipmentFile = searchRes.value.find((f: any) => f.name.includes('xlsx') || f.name.includes('xls'));

    if (equipmentFile) {
        report.foundFile = equipmentFile;
        report.steps.push(`✅ FOUND FILE: ${equipmentFile.name}`);
        
        report.RECOMMENDED_ENV = {
            EXCEL_SITE_ID: site.id,
            EXCEL_DRIVE_ID: defaultDrive.id,
            EXCEL_FILE_ID: equipmentFile.id
        };
    } else {
        report.steps.push("❌ Could not find an 'Equipment' file via search. Listing root...");
        const rootChildren = await client.api(`/sites/${site.id}/drives/${defaultDrive.id}/root/children`).get();
        report.rootListing = rootChildren.value;
    }

    return NextResponse.json(report, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
