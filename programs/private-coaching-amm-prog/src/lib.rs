use anchor_lang::prelude::*;

pub mod constants;

pub mod instructions;
pub use instructions::*;

pub mod errors;
pub use errors::*;

declare_id!("AT9ApNUHABR9bLHzBbKKz2u19U6tzp4SifkKBfX4SpqM");

#[program]
pub mod private_coaching_amm_prog {
  use crate::instructions::CreatePool;

  use super::*;

  pub fn create_ppol(ctx: Context<CreatePool>) -> Result<()> {
    create_pool::exec(ctx)
  }

  pub fn swap(ctx: Context<Swap>) -> Result<()> {
    swap::exec(ctx)
  }
}

#[derive(Accounts)]
pub struct Initialize {}
