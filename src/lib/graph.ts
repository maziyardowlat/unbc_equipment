import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

let mockLastId = 378;

export class GraphHelper {
  private client: Client | null = null;
  private isMock: boolean = false;

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

  async getLatestEquipId(): Promise<string> {
    if (this.isMock) {
      // Simulation: Return a static or incrementing mock ID
      return (mockLastId + 1).toString();
    }

    try {
      const driveId = process.env.EXCEL_FILE_ID; // In reality, might need Drive ID + Item ID logic
      // Assuming we are just reading the used range of the specific worksheet
      if (!this.client) throw new Error('Client not initialized');

      // This is a simplified Graph call. In prod, you'd likely use /drives/{id}/items/{id}/workbook/worksheets/{name}/usedRange
      // For now, let's assume we are fetching from a table or range.
      // Logic: Get the last used row in Column A (Equip_ID)
      
      // Pseudo-implementation for real graph (requires specific Drive/Item IDs to be known)
      // const response = await this.client.api(`/me/drive/items/${fileId}/workbook/worksheets('Sheet1')/usedRange`).get();
      // return parseLastId(response);
      
      return "0"; // Placeholder for real logic until IDs are known
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch from Excel');
    }
  }

  async addRow(data: any): Promise<void> {
    if (this.isMock) {
      console.log('MOCK ADD ROW:', data);
      mockLastId++; // Increment in memory for the session
      return;
    }

    if (!this.client) throw new Error('Client not initialized');

    // Real Graph Logic:
    // await this.client.api(...).post({...})
    // For now, fail safely if they try to switch to real without IDs
    throw new Error('Real implementation requires valid IDs and User Token');
  }
}
