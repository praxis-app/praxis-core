import { IconType } from 'react-icons/lib';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface Props {
  Icon: IconType;
  label: string;
  onClick?: () => void;
  to?: string;
}

export const SettingsNavItem = ({ Icon, label, onClick, to }: Props) => {
  const renderButton = () => (
    <Button
      className="text-md flex justify-between gap-6 w-full py-6"
      onClick={onClick}
    >
      <div className="flex gap-2">
        <Icon className="size-5 self-center" />
        {label}
      </div>
      <MdChevronRight className="size-6" />
    </Button>
  );

  if (to) {
    return (
      <Link to={to} className="w-full">
        {renderButton()}
      </Link>
    );
  }

  return renderButton();
};
