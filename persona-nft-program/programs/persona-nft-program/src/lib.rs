use anchor_lang::prelude::*;

declare_id!("Duhi4SnrUMRahTHRPC6fmQUURViKhZv6qwFiTR2otEC6");

#[program]
pub mod persona_nft_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
