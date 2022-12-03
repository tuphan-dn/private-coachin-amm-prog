use crate::constants::*;
use anchor_lang::prelude::*;
use num_traits::ToPrimitive;

#[account]
pub struct Pool {
  pub authority: Pubkey,
  pub x: u64,
  pub y: u64,
}

impl Pool {
  pub const LEN: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + U64_SIZE + U64_SIZE;

  pub fn swap(&self, a: u64) -> Option<(u64, u64, u64)> {
    let x_ = self.x.checked_add(a)?;
    let y_ = self
      .x
      .to_u128()?
      .checked_mul(self.y.to_u128()?)?
      .checked_div(x_.to_u128()?)?
      .to_u64()?;
    let b = self.y.checked_sub(y_)?;
    Some((b, x_, y_))
  }
}
