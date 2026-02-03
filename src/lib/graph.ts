import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

let mockLastId = 378;

interface ExcelRow {
  values: (string | number | boolean | null)[][];
}

export class GraphHelper {
  private client: Client | null = null;
  private isMock: boolean = false;
  
  // IDs can be passed in or read from env.
  // Ideally, store them in env for simplicity across the app.
  private siteId = process.env.EXCEL_SITE_ID;
  private driveId = process.env.EXCEL_DRIVE_ID;
  private itemId = process.env.EXCEL_FILE_ID;

  constructor(accessToken?: string) {
    if (process.env.USE_MOCK_DATA === 'true' || !accessToken) {
      this.isMock = true;
    } else {
      this.client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
    }
  }

  // Construct the base path for the item
  // If Site/Drive/Item all present: /sites/{site}/drives/{drive}/items/{item}
  // If only Item present: /me/drive/items/{item} (Personal OneDrive)
  private getBasePath(): string {
     if (this.siteId && this.driveId && this.itemId) {
         return `/sites/${this.siteId}/drives/${this.driveId}/items/${this.itemId}`;
     }
     if (this.itemId) {
         return `/me/drive/items/${this.itemId}`;
     }
     throw new Error('Missing EXCEL_FILE_ID (and potentially EXCEL_SITE_ID/EXCEL_DRIVE_ID) in environment variables.');
  }

  async getLatestEquipId(): Promise<string> {
    if (this.isMock) {
      return (mockLastId + 1).toString();
    }

    if (!this.client) throw new Error('Client not initialized');

    try {
      const basePath = this.getBasePath();
      // Get the used range of the first worksheet
      // We assume the first sheet is the target. Address if not.
      // We explicitly request the 'values' to find the last ID.
      // Note: This fetches the ENTIRE used range. If the sheet is huge, we might need a more optimized query (e.g. just column A).
      // Optimization: Get used range of Column A.
      
      const response = await this.client.api(`${basePath}/workbook/worksheets('Equipment')/range(address='A:A')/usedRange`).get();
      
      const values = response.values as any[][];
      if (!values || values.length <= 1) return "0"; // Header only or empty

      // The last row in the used range of A:A *should* be the last ID.
      // Row 0 is header "Equip_ID"
      const lastValue = values[values.length - 1][0];
      
      // Ensure it's a number
      const id = parseInt(String(lastValue));
      if (isNaN(id)) {
          // Fallback check: maybe the last row is empty or not an ID? 
          // Iterate backwards
           for (let i = values.length - 1; i >= 0; i--) {
               const val = parseInt(String(values[i][0]));
               if (!isNaN(val)) return val.toString();
           }
           return "0";
      }

      return id.toString();
    } catch (error) {
      console.error('Error fetching latest ID from Excel:', error);
      throw new Error('Failed to fetch from Excel');
    }
  }

  async addRow(data: any): Promise<void> {
    if (this.isMock) {
      console.log('MOCK ADD ROW:', data);
      mockLastId++;
      return;
    }

    if (!this.client) throw new Error('Client not initialized');

    try {
      const basePath = this.getBasePath();
      
      // Append a row to the 'Equipment' table or sheet.
      // If it's a Table, we use /tables/{name}/rows/add
      // If just a Range, we can verify the next empty cell or just use tables if one exists.
      // The prompt implies a "spreadsheet" - let's assume we append to the bottom of the used range.
      // Best way to "Add Row" in raw Excel without a Table object is tricky. 
      // Safest: Use the Table API if a table exists. If not, finding the next empty row is manual.
      // Assumption: There IS a table named 'Table1' or similar, OR we act on the Sheet.
      
      // Attempt 1: Add to the end of the sheet using specific values (mapped from data)
      // We need to map `data` object keys to the column order provided in the User PROMPT rules or implied via existing sheet?
      // Since I don't know the exact column order of the sheet 'Equipment', I really should know it.
      // For now, I will assume `data` comes in AS an array of values matching the columns.
      // OR, if `data` is an object {Equip_ID: 1, ...}, I need to map it.
      
      // CRITICAL: The prompt listing has specific fields. 
      // I'll assume for this step, we just POST the `values` array matching the columns.
      // The `data` passed in strictly needs to be a flat array of values [ID, Code, Type, ...].
      
      await this.client.api(`${basePath}/workbook/worksheets('Equipment')/tables/1/rows`).post({
          values: [ data ] // data should be an array like [101, 'Code', 'Desc'...]
      });
      
      // Note: If no table exists, this will fail. Retrying with "usedRange" logic is very complex for "ADD".
      // Let's assume a Table exists.
      
    } catch (error) {
      console.error('Error adding row to Excel:', error);
      // Fallback: If table not found, try to append to last row + 1?
      // Without knowing the schema, this is risky.
      throw new Error('Failed to write to Excel. Ensure a Table exists in the Equipment sheet.');
    }
  }
}
