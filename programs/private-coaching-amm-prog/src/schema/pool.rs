use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Pool {
  pub authority: Pubkey,
  pub x: u64,
  pub y: u64,
}

impl Pool {
  pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + U64_SIZE + U64_SIZE;
}
