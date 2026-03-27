import { exec } from "child_process";
import path from "path";

export async function POST(req) {
  const { rainfall, elevation, drainage, waterlogging } = await req.json();

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "ml", "predict.py");

    exec(
      `.\\.venv\\Scripts\\python.exe "${scriptPath}" ${rainfall} ${elevation} ${drainage} ${waterlogging}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python Error:", stderr);
          resolve(
            new Response(JSON.stringify({ error: stderr }), { status: 500 })
          );
        } else {
          const [level, confidence] = stdout.trim().split(",");

          resolve(
            new Response(
              JSON.stringify({
                risk: level,
                confidence: parseFloat(confidence),
              }),
              { status: 200 }
            )
          );
        }
      }
    );
  });
}
