import { useHelloWorld } from '@/hooks/useHelloWorld';
import { createFileRoute } from '@tanstack/react-router';
import i18next from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data, isLoading } = useHelloWorld();
  const { t } = useTranslation('common');
  return (
    <div className="p-2">
      <h3>Welcome Home! {t('hello')}</h3>
      <p>Data från backend:en</p>
      <div>{JSON.stringify(data, null, 2)}</div>
      <button
        onClick={() => {
          i18next.changeLanguage(i18next.language === 'en' ? 'sv' : 'en');
        }}
      >
        Byt språk
      </button>
    </div>
  );
}
