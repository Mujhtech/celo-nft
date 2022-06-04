import { useContract } from "./useContract";
import MyEpicGameAbi from "../utils/MyEpicGame.json";
import MyEpicGameAddress from "../utils/MyEpicGameAddress.json";

export const useMinterContract = () =>
  useContract(MyEpicGameAbi.abi, MyEpicGameAddress.MyEpicGame);
