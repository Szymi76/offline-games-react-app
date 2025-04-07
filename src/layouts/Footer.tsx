import { Link } from "@nextui-org/react";

const depList = [
  { name: "Vite", link: "https://vitejs.dev/" },
  { name: "NextUI", link: "https://nextui.org/" },
  { name: "Tailwind", link: "https://tailwindcss.com/" },
  { name: "Lucide", link: "https://lucide.dev/" },
  { name: "unDraw", link: "https://undraw.co/" },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-default-200">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-1 px-5 py-3">
        <div className="flex flex-wrap gap-2 text-sm">
          <p className="text-default-500">Stronka wykonana przy pomocy</p>
          {depList.map((item) => (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="hover:text-secondary"
            >
              {item.name}
            </a>
          ))}
          <p className="text-default-500">I wiele innych...</p>
        </div>
        <Link size="sm" className="hover:cursor-pointer">
          Github
        </Link>
        <p className="text-sm"> © 2024. Wszelkie prawa nie zastrzeżone.</p>
      </div>
    </footer>
  );
};

export default Footer;
