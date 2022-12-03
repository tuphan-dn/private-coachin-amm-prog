import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PrivateCoachingAmmProg } from "../target/types/private_coaching_amm_prog";

describe("private-coaching-amm-prog", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PrivateCoachingAmmProg as Program<PrivateCoachingAmmProg>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
