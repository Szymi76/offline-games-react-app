import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
  DropdownItem,
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
import { Link as RouterLink } from "react-router-dom";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import useDarkMode from "use-dark-mode";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useWindowSize } from "react-use";

export default function Navigator2() {
  const darkMode = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Games", href: "/games" },
    { title: "Zakładki", href: "/bookmarks" },
  ];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand as={RouterLink} to="/">
          <Gamepad2 />
          <p className="ml-1 font-bold text-inherit">Gry offline</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarBrand as={RouterLink} to="/">
          <Gamepad2 />
          <p className="mx-1 font-bold text-inherit">Gry offline</p>
        </NavbarBrand>
        {menuItems.map((item, index) => (
          <CustomNavbarItem href={item.href} key={`${item.title}-${index}`}>
            {item.title}
          </CustomNavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Switch
          isSelected={darkMode.value}
          size="sm"
          color="success"
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
          onValueChange={() => darkMode.toggle()}
          // className="hidden sm:block"
        ></Switch>
        <ConditionalRightSideNavbarContent />
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <CustomNavbarItem key={`${item}-${index}`} href={item.href} size="lg">
            {item.title}
          </CustomNavbarItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

type CustomNavbarItemProps = {
  children: React.ReactNode;
  href: string;
  size?: "lg";
};
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
        size={props.size ? "lg" : "md"}
      >
        {props.children}
      </Link>
    </NavbarItem>
  );
};

const ConditionalRightSideNavbarContent = () => {
  const [user, loading, error] = useAuthState(auth);
  const { enqueueSnackbar } = useSnackbar();
  const { width } = useWindowSize();

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
      <Button
        as={RouterLink}
        to="/auth/login"
        size={width > 640 ? "md" : "sm"}
        color="primary"
        variant="flat"
      >
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
          as={RouterLink}
          // @ts-ignore
          to="/settings"
          key="settings"
          startContent={<Settings size={18} />}
        >
          Ustawienia
        </DropdownItem>
        <DropdownItem
          as={RouterLink}
          // @ts-ignore
          to="/bookmarks"
          key="settings"
          startContent={<Bookmark size={18} />}
        >
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
