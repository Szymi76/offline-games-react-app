import React from "react";
import HeroIllustration from "@/assets/hero-illustration.svg";
import { Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";

const Home = () => {
  return (
    <main className="flex gap-5 px-5 pt-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h1 className="max-w-md text-5xl font-bold text-default-900">
          Graj w klasyczne gry gdy ci się nudzi, w szkole, pracy czy nawet w
          domu
        </h1>
        <p className="max-w-md text-xl font-semibold text-default-600">
          Gry, które tutaj znajdziesz działają w 100% bez łączności z innymi
          usługami
        </p>
        <div className="w-full max-w-md">
          <Button
            endContent={<MoveRight />}
            size="lg"
            className="font-semibold"
            color="secondary"
          >
            Pokaż listę gier
          </Button>
        </div>
      </div>
      <div className="hidden flex-1 lg:block">
        <img src={HeroIllustration} />
      </div>
    </main>
  );
};

export default Home;
