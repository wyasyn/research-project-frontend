/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, CameraIcon, UploadIcon } from "lucide-react";
import Webcam from "react-webcam";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  onSubmit: (imageUrl: string) => void;
}

export function ImageUpload({ onSubmit }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setIsUploading(true);

      // Compress the image to ensure it's under 100kB
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1, // 100kB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "onboarding_images");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const captureWebcam = useCallback(async () => {
    if (!webcamRef.current) return;

    try {
      setError(null);
      setIsUploading(true);

      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }

      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Compress the image
      const compressedFile = await imageCompression(
        new File([blob], "webcam.jpg", { type: "image/jpeg" }),
        {
          maxSizeMB: 0.1, // 100kB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        }
      );

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "onboarding_images");

      const uploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/your-cloud-name/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await uploadResponse.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error("Error capturing/uploading image:", err);
      setError("Failed to capture or upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [webcamRef]);

  const handleSubmit = () => {
    if (image) {
      onSubmit(image);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Image</h2>
        <p className="text-muted-foreground">
          Add a profile image for the admin account.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="webcam">
            <CameraIcon className="mr-2 h-4 w-4" />
            Webcam
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                {image ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-full">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Uploaded profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-muted hover:bg-muted/80"
                  >
                    <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload
                    </span>
                  </div>
                )}

                <input
                  title="image upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!image && (
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Select Image"}
                  </Button>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                {image && (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setImage(null)}
                      disabled={isUploading}
                    >
                      Change
                    </Button>
                    <Button onClick={handleSubmit} disabled={isUploading}>
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webcam" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                {image ? (
                  <div className="relative h-40 w-40 overflow-hidden rounded-full">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Captured profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        width: 320,
                        height: 240,
                        facingMode: "user",
                      }}
                      className="h-[240px] w-[320px]"
                    />
                  </div>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}

                {!image ? (
                  <Button onClick={captureWebcam} disabled={isUploading}>
                    {isUploading ? "Processing..." : "Take Photo"}
                  </Button>
                ) : (
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setImage(null)}
                      disabled={isUploading}
                    >
                      Retake
                    </Button>
                    <Button onClick={handleSubmit} disabled={isUploading}>
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
