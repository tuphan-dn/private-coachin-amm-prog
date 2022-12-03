use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Swap<'info> {}

pub fn exec(ctx: Context<Swap>) -> Result<()> {
  Ok(())
}
