import { GetServerSideProps } from "next";
import { DashboardPage } from "@/modules/dashboard/page";
import { withProtectedAuth } from "@/utils/auth"

export default function Dashboard() {
  return <DashboardPage />;
}

export const getServerSideProps = withProtectedAuth();
