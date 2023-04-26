import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(true);
  const [Side_nav_width, setSide_nav_width] = useState(280);

  const LayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: Side_nav_width,
    },
  }));
  useEffect(() => {
    setSide_nav_width(openNav ? 280 : 0);
  }, [openNav]);
  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(true);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(!openNav)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});
