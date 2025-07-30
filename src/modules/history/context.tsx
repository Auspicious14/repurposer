import api from "@/lib/api";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface IHistoryState {
  history: any[];
  loading: boolean;
  fetchHistory: () => void;
}

const HistoryContext = createContext<IHistoryState | undefined>(undefined);

export const useHistory = () => {
  const context = useContext(HistoryContext);

  if (!context || context === undefined) {
    throw new Error(
      "History context must be used within the App Global Provider"
    );
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const HistoryContextProvider: React.FC<IProps> = ({ children }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistory = async () => {
    setLoading(true);

    try {
      const res = await api.get("/history");

      const status = res?.data?.success;

      if (status && res?.status === 200) {
        const data = res?.data?.data;
        setHistory(data);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <HistoryContext.Provider value={{ history, loading, fetchHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
