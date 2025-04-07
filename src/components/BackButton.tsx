import { ArrowBigLeft } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="faded"
      color="default"
      className="absolute top-3 left-3 font-semibold"
      startContent={<ArrowBigLeft />}
      onPress={() => navigate(-1)}
    >
      Wróć
    </Button>
  );
};

export default BackButton;
