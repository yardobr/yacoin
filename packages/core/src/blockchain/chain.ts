import { Block } from "../types/block";
import { createGenesisBlock } from "./genesis";

export const blockchain: Block[] = [createGenesisBlock()]; 