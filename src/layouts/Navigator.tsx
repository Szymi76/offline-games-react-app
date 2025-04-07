import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
} from "@nextui-org/react";
import {
  Bookmark,
  Gamepad2,
  LogOut,
  MoonIcon,
  Settings,
  SunIcon,
} from "lucide-react";

import Loading from "@/components/Loading";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import useDarkMode from "use-dark-mode";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

const Navigator = () => {
  const darkMode = useDarkMode();

  return (
    <Navbar isBlurred isBordered>
      <NavbarBrand as={RouterLink} to="/" className="gap-1">
        <Gamepad2 />
        <p className="font-bold italic">OFFLINE GAMES</p>
      </NavbarBrand>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <CustomNavbarItem href="/">Home</CustomNavbarItem>
        <CustomNavbarItem href="/leaderboard">Leaderboard</CustomNavbarItem>
        <CustomNavbarItem href="/games">Games</CustomNavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Switch
          isSelected={darkMode.value}
          size="sm"
          color="success"
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
          onValueChange={() => darkMode.toggle()}
        ></Switch>
        <ConditionalRightSideNavbarContent />
      </NavbarContent>
    </Navbar>
  );
};

export default Navigator;

type CustomNavbarItemProps = { children: React.ReactNode; href: string };
const CustomNavbarItem = (props: CustomNavbarItemProps) => {
  const { pathname } = useLocation();
  const isActive = props.href === pathname;

  return (
    <NavbarItem isActive={isActive}>
      <Link
        as={RouterLink}
        to={props.href}
        aria-current={isActive ? "page" : "false"}
        color={isActive ? "secondary" : "foreground"}
      >
        {props.children}
      </Link>
    </NavbarItem>
  );
};

const ConditionalRightSideNavbarContent = () => {
  const [user, loading, error] = useAuthState(auth);
  const { enqueueSnackbar } = useSnackbar();

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        enqueueSnackbar({ variant: "info", message: "Zostałeś wylogowany" });
      })
      .catch((err) => {
        enqueueSnackbar({
          variant: "error",
          message: "Coś poszło nie tak podczas wylogowywania",
        });
      });
  };

  if (loading) return <Loading />;

  if (!user)
    return (
      <Button as={RouterLink} to="/auth/login" color="primary" variant="flat">
        Zaloguj się
      </Button>
    );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="default"
          size="sm"
          name={user.displayName ?? undefined}
          src={user.photoURL ?? undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="faded">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Zalogowano jako</p>
          <p className="font-semibold text-gray-400">{user.email}</p>
        </DropdownItem>
        <DropdownItem
          as={Link}
          href="/settings"
          key="settings"
          className="text-default-900"
          startContent={<Settings size={18} />}
        >
          Ustawienia
        </DropdownItem>
        <DropdownItem key="settings" startContent={<Bookmark size={18} />}>
          Zakładki
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={handleSignOut}
          startContent={<LogOut size={18} />}
        >
          Wyloguj się
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
