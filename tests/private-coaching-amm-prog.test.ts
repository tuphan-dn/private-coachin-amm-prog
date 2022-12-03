import {
  AnchorProvider,
  setProvider,
  workspace,
  Spl,
  web3,
  BN,
  utils,
} from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PrivateCoachingAmmProg } from "../target/types/private_coaching_amm_prog";
import { initializeAccount, initializeMint, mintTo } from "./pretest";

describe("private-coaching-amm-prog", () => {
  // Configure the client to use the local cluster.
  const provider = AnchorProvider.env();
  setProvider(provider);

  const program =
    workspace.PrivateCoachingAmmProg as Program<PrivateCoachingAmmProg>;
  const spl = Spl.token();

  const xToken = new web3.Keypair();
  let xTokenAccount: web3.PublicKey;
  const yToken = new web3.Keypair();
  let yTokenAccount: web3.PublicKey;

  const pool = new web3.Keypair();
  let treasurer: web3.PublicKey;
  let xTreasury: web3.PublicKey;
  let yTreasury: web3.PublicKey;

  before(async () => {
    // Init mints
    await initializeMint(6, xToken, spl);
    await initializeMint(6, yToken, spl);
    // Init accounts
    xTokenAccount = await utils.token.associatedAddress({
      mint: xToken.publicKey,
      owner: provider.wallet.publicKey,
    });
    await initializeAccount(
      xTokenAccount,
      xToken.publicKey,
      provider.wallet.publicKey,
      provider
    );
    yTokenAccount = await utils.token.associatedAddress({
      mint: yToken.publicKey,
      owner: provider.wallet.publicKey,
    });
    await initializeAccount(
      yTokenAccount,
      yToken.publicKey,
      provider.wallet.publicKey,
      provider
    );
    // Mint tokens
    await mintTo(new BN("1000000000000"), xToken.publicKey, xTokenAccount, spl);
    await mintTo(new BN("1000000000000"), yToken.publicKey, yTokenAccount, spl);
    // Derive treasury & treasurer
    const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
      [Buffer.from("treasurer"), pool.publicKey.toBuffer()],
      program.programId
    );
    treasurer = treasurerPublicKey;
    xTreasury = await utils.token.associatedAddress({
      mint: xToken.publicKey,
      owner: treasurer,
    });
    yTreasury = await utils.token.associatedAddress({
      mint: yToken.publicKey,
      owner: treasurer,
    });
  });

  it("Create pool", async () => {
    // Add your test here.
    const txId = await program.methods
      .createPpol(new BN("500000000000"), new BN("500000000000"))
      .accounts({
        authority: provider.wallet.publicKey,
        pool: pool.publicKey,
        xToken: xToken.publicKey,
        yToken: yToken.publicKey,
        srcXAccount: xTokenAccount,
        srcYAccount: yTokenAccount,
        treasurer: treasurer,
        xTreasury: xTreasury,
        yTreasury: yTreasury,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([pool])
      .rpc();
    console.log("Your transaction signature", txId);
  });
});
