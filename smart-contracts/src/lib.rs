use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod personachain {
    use super::*;

    pub fn create_personality_nft(
        ctx: Context<CreatePersonalityNFT>,
        personality_type: String,
        score: u32,
    ) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;
        nft_account.owner = ctx.accounts.user.key();
        nft_account.personality_type = personality_type;
        nft_account.score = score;
        nft_account.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePersonalityNFT<'info> {
    #[account(init, payer = user, space = 8 + 256)]
    pub nft_account: Account<'info, PersonalityNFT>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PersonalityNFT {
    pub owner: Pubkey,
    pub personality_type: String,
    pub score: u32,
    pub created_at: i64,
}
