import { createContext, useState, useEffect } from "react";
import InstagramAPI from "../services/Api.jsx";

export const AppContext = createContext();

export function AppContextProvider(props) {
  const [instagramAPI, setInstagramAPI] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 segundos por defecto
  const [lastUpdate, setLastUpdate] = useState(null);

  // Inicializar API cuando hay un access token
  useEffect(() => {
    if (accessToken) {
      setInstagramAPI(new InstagramAPI(accessToken));
    }
  }, [accessToken]);

  // Obtener datos de engagement
  const fetchEngagementData = async (silent = false) => {
    if (!instagramAPI) return;

    if (!silent) setLoading(true);
    setError(null);

    try {
      const data = await instagramAPI.getTotalEngagement();
      setEngagementData(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Auto-refresh con intervalo
  useEffect(() => {
    if (autoRefresh && instagramAPI) {
      const interval = setInterval(() => {
        fetchEngagementData(true); // silent mode
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, instagramAPI]);

  return (
    <AppContext.Provider
      value={{
        instagramAPI,
        accessToken,
        setAccessToken,
        engagementData,
        loading,
        error,
        fetchEngagementData,
        autoRefresh,
        setAutoRefresh,
        refreshInterval,
        setRefreshInterval,
        lastUpdate,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
