/** @format */

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
// import dotenv from "dotenv";

const BACKEND_UPLOAD_URL = "https://deploy.100xnavi.com";
// const BACKEND_UPLOAD_URL =
// ("http://ec2-3-110-219-89.ap-south-1.compute.amazonaws.com:9000");

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const testing = "https://github.com/nxvtej/vercel-test";
  const [uploadId, setUploadId] = useState("");
  const BACKEND_HANDLE_URL = `https://${uploadId}.deployed.100xnavi.com`;
  // const BACKEND_HANDLE_URL_LOCAL = `http://${uploadId}.localhost:3001/index.html`;
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [status, setStatus] = useState("");
  const [push, setPush] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    console.log(
      "useEffect running with uploadId:",
      uploadId,
      "deployed:",
      deployed
    );

    if (uploadId && !deployed) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${BACKEND_UPLOAD_URL}/status?id=${uploadId}`
          );
          setStatus(response.data.status);

          if (response.data.status === "deployed") {
            setDeployed(true);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error fetching status:", err);
        }
      }, 5000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [uploadId, deployed]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">
            Deploy your GitHub Repository
          </CardTitle>
          <CardDescription>
            Enter the URL of your GitHub repository to deploy it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/nxvtej/vercel-test"
              />
              <Input
                placeholder="enter custom name (small_cap only)"
                onChange={(e) => {
                  setId(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-xs text-gray-600 underline">
                Want demo react project link?? Push{"-->"}
              </span>
              <div>
                <Button
                  onClick={() => {
                    setRepoUrl(testing);
                    setPush(true);
                    setRepoUrl("https://github.com/nxvtej/vercel-test");
                  }}
                  size={"sm"}
                >
                  {push ? "Done" : "Push"}
                </Button>
              </div>
            </div>
            <Button
              onClick={async () => {
                setUploading(true);
                try {
                  const res = await axios.post(
                    `${BACKEND_UPLOAD_URL}/project`,
                    {
                      gitUrl: repoUrl,
                      name: id,
                    }
                  );
                  console.log("POST /project response data:", res.data); // Check this log
                  console.log("Project ID from response:", res.data.project); // Check this log
                  setUploadId(res.data.data.project);
                  setUploading(false);
                  // setDeployed(true);
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    console.error("Response data:", error.response?.data);
                    console.error("Response status:", error.response?.status);
                  } else {
                    console.error("Unknown error:", error);
                  }
                  setUploading(false);
                }
              }}
              disabled={uploading}
              className="w-full"
              type="submit"
            >
              {uploadId
                ? `Deploying (${uploadId})`
                : uploading
                ? "Uploading..."
                : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {uploadId && (
        <Card className="w-full max-w-md mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Deployment Status</CardTitle>
            <CardDescription>
              {deployed
                ? "Your website will be successfully deployed in 30s!"
                : "Deploying... Please wait."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="deployed-url">Deployed URL</Label>
              <Input
                id="deployed-url"
                readOnly
                type="url"
                value={BACKEND_HANDLE_URL}
              />
            </div>
            <br />
            <Button className="w-full" variant="outline" disabled={!deployed}>
              <a href={BACKEND_HANDLE_URL} target="_blank">
                {deployed ? "Visit Website" : `${status}`}
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
