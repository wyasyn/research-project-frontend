import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { images } from "@/assets/images/images";
import NavItem from "./nav-item";
import SettingsBtn from "./settimgs";
import SidebarWrapper from "./sidebar-wrapper";

export default function DashboardNav() {
  return (
    <SidebarWrapper>
      <Button variant="ghost" size={"icon"} asChild>
        <Link href="/">
          <Image src={images.logo.src} alt="Logo" width={32} height={32} />
        </Link>
      </Button>
      <section className="flex flex-col gap-8">
        <NavItem />
        <NavItem />
      </section>
      <SettingsBtn />
    </SidebarWrapper>
  );
}
