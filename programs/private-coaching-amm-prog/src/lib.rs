use anchor_lang::prelude::*;

pub mod constants;

pub mod instructions;
pub use instructions::*;

pub mod schema;
pub use schema::*;

pub mod errors;
pub use errors::*;

declare_id!("AT9ApNUHABR9bLHzBbKKz2u19U6tzp4SifkKBfX4SpqM");

#[program]
pub mod private_coaching_amm_prog {
  use crate::instructions::CreatePool;

  use super::*;

  pub fn create_ppol(ctx: Context<CreatePool>, x: u64, y: u64) -> Result<()> {
    create_pool::exec(ctx, x, y)
  }

  pub fn swap(ctx: Context<Swap>, a: u64) -> Result<()> {
    swap::exec(ctx, a)
  }
}

#[derive(Accounts)]
pub struct Initialize {}
