import { GetServerSideProps } from "next";
import { DashboardPage } from "@/modules/dashboard/page";

export default function Dashboard() {
  return <DashboardPage />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies?.token;

  // if (!token) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: {},
  };
};
