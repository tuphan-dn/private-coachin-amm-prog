use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Pool {
  pub authority: Pubkey,
}

impl Pool {
  pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE;
}
