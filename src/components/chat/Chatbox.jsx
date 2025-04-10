// import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
    className={`
      ${selectedChat ? 'flex' : 'hidden'} md:flex
      items-center
      flex-col
      p-3
      bg-white
      w-full md:w-2/3
      rounded-lg
      border
    `}
  >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
  </div>
  );
};

export default Chatbox;
