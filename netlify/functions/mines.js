import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async () => {
  try {
    const command = new GetObjectCommand({
      Bucket: "coal-mine-dashboard-2026-gagan",
      Key: "Coal-mine-data/data/dashboard_mines.json",
    });

    const response = await s3.send(command);

    const text = await response.Body.transformToString();
    const data = JSON.parse(text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Could not load mine data",
      }),
    };
  }
};