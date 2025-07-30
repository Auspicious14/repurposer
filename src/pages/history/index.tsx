import HistoryPage from "@/modules/history/page";
import { withProtectedAuth } from "@/utils/auth";
import React from "react";

const History = () => {
  return <HistoryPage />;
};

export default History;

export const getServerSideProps = withProtectedAuth();
