import { createMongoAbility } from '@casl/ability';
import { useAppStore } from '../store/app.store';
import { AppAbility } from '../types/role.types';
import { useMeQuery } from './use-me-query';

export const useAbility = () => {
  const { isLoggedIn } = useAppStore((state) => state);
  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const permissions = meData?.user.permissions ?? [];
  const ability = createMongoAbility<AppAbility>(permissions);

  return ability;
};
