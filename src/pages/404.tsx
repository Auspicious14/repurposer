import { useEffect } from "react";
import { useRouter } from "next/router";
import NotFound from "@/components/common/NotFound";

export default function Custom404() {
  const router = useRouter();

  // useEffect(() => {
  // Optionally, you can redirect to home or log the 404 event
  // For now, we'll just render the NotFound component
  // }, []);

  return <NotFound />;
}
