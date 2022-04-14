import Link from "next/link";
import { IndexLayout } from "../layout/IndexLayout";
import { IndexScreen } from "../domains/index/IndexScreen";
import { usePublications } from "../api/usePublications";

export default function Home() {
  const { data, loading, mutate: refreshPublications } = usePublications();

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
