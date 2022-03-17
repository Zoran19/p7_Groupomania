import { IndexLayout } from "../layout/IndexLayout";
import { usePublications } from "../api/usePublications";
import { ProfilScreen } from "../domains/profil/ProfilScreen";
import { useProfil } from "../api/useProfil";

export default function Profil() {
  const { data, loading, mutate: refreshProfil } = useProfil();

  return (
    <div>
      <IndexLayout>
        <ProfilScreen
          loading={loading}
          profil={data}
          refreshProfil={refreshProfil}
        />
      </IndexLayout>
    </div>
  );
}
