import ClientPage from "@/components/ClientPage";
import { getVisualizerPresets } from "@/lib/actions";

const Home = async () => {
  const presets = await getVisualizerPresets();

  return <ClientPage presets={presets} />;
};

export default Home;
