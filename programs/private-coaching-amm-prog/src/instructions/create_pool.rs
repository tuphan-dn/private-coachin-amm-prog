use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreatePool<'info> {}

pub fn exec(ctx: Context<CreatePool>) -> Result<()> {
  Ok(())
}
