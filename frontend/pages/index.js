import Link from "next/link";
import { IndexLayout } from "../layout/IndexLayout";
import { IndexScreen } from "../domains/index/IndexScreen";
import { usePublications } from "../api/usePublications";

//import { useProfil } from "../api/useProfil";

export default function Home() {
  const { data, loading, mutate: refreshPublications } = usePublications();

  // const { data: profileData, loading: profileLoading } = useProfil();

  return (
    <div>
      <IndexLayout>
        <IndexScreen
          loading={loading}
          publications={data}
          refreshPublications={refreshPublications}
        />
      </IndexLayout>
    </div>
  );
}
