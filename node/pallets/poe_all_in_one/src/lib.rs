#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/v3/runtime/frame>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::pallet_prelude::*;
	use frame_system::pallet_prelude::*;
	use sp_std::vec::Vec;

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	// The pallet's runtime storage items.
	// https://docs.substrate.io/v3/runtime/storage
	#[pallet::storage]
	#[pallet::getter(fn poe_types)]
	// Learn more about declaring storage items:
	// https://docs.substrate.io/v3/runtime/storage#declaring-storage-items
    pub(super) type PoeTypes<T: Config> = StorageMap<_, Blake2_128Concat, Vec<u8>, (Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, T::AccountId, T::BlockNumber), ValueQuery>;
    
	#[pallet::storage]
	#[pallet::getter(fn proof)]
	pub(super) type Proofs<T: Config> = StorageDoubleMap<_, Blake2_128Concat, Vec<u8>, Blake2_128Concat, Vec<u8>, (Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, T::AccountId, T::BlockNumber), ValueQuery>;
	
	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/v3/runtime/events-and-errors
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [poe_types, who]
		PoeTypeCreated(T::AccountId, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>),
		ProofCreated(T::AccountId, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>, Vec<u8>),
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
        PoeTypeAlreadyCreated,
        ProofAlreadyCreated,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
        #[pallet::weight(1_000_000)]
        pub fn create_poe_type(
            origin: OriginFor<T>,
            poe_type: Vec<u8>,
            name: Vec<u8>,
            description: Vec<u8>,
            field_1: Vec<u8>,
            field_2: Vec<u8>,
            field_3: Vec<u8>,
            field_4: Vec<u8>,
            field_5: Vec<u8>,
        ) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            ensure!(!PoeTypes::<T>::contains_key(&poe_type), Error::<T>::PoeTypeAlreadyCreated);
            let current_block = <frame_system::Pallet<T>>::block_number();
            PoeTypes::<T>::insert(&poe_type, (&name, &description, &field_1, &field_2, &field_3, &field_4, &field_5, &sender, current_block));
            Self::deposit_event(Event::PoeTypeCreated(sender, poe_type, name, description, field_1, field_2, field_3, field_4, field_5));
            Ok(())
        }
        #[pallet::weight(1_000_000)]
        pub fn create_proof(
            origin: OriginFor<T>,
            poe_type: Vec<u8>,
            proof: Vec<u8>,
            value_1: Vec<u8>,
            value_2: Vec<u8>,
            value_3: Vec<u8>,
            value_4: Vec<u8>,
            value_5: Vec<u8>,
        ) -> DispatchResult {
            let sender = ensure_signed(origin)?;
            ensure!(!Proofs::<T>::contains_key(&poe_type, &proof), Error::<T>::ProofAlreadyCreated);
            let current_block = <frame_system::Pallet<T>>::block_number();
            Proofs::<T>::insert(&poe_type, &proof, (&value_1, &value_2, &value_3, &value_4, &value_5, &sender, current_block));
            Self::deposit_event(Event::ProofCreated(sender, poe_type, proof, value_1, value_2, value_3, value_4, value_5));
            Ok(())
        }
    }
}
