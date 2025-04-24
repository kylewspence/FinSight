import { useMediaQuery } from '@/hooks/use-media-query';
import InvestmentsDesktop from './InvestmentsDesktop';
import InvestmentsMobile from './InvestmentsMobile';

interface Asset {
  name: string;
  sector: string;
  shares: string;
  price: string;
  value: string;
}

interface InvestmentData {
  id: string;
  date: string;
  value: string;
  return: string;
  assets: Asset[];
}

interface InvestmentsProps {
  data: InvestmentData[];
}

const Investments = ({ data }: InvestmentsProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? <InvestmentsDesktop data={data} /> : <InvestmentsMobile data={data} />;
};

export default Investments; 