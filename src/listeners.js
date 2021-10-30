import api from "./api";
import { getOrderToken } from "./utils";
import {
  displayUnavailableMessage,
  toggleShoppingBag,
  openShoppingBag,
} from "./ui";

export default {
  setupVariants: () => {
    const variantRadios = document.querySelectorAll(".clayer-variant-radio");
    variantRadios.forEach((variantRadio) => {
      variantRadio.addEventListener("click", () => {
        api.selectSku(
          variantRadio.value,
          variantRadio.dataset.skuName,
          variantRadio.dataset.skuCode,
          variantRadio.dataset.skuImageUrl,
          variantRadio.dataset.priceContainerId,
          variantRadio.dataset.availabilityMessageContainerId,
          variantRadio.dataset.addToBagId,
          variantRadio.dataset.addToBagQuantityId
        );
      });
    });
  },
  setupAddVariantQuantity: () => {
    const addVariantsQuantity = document.querySelectorAll(
      ".clayer-add-to-bag-quantity"
    );
    addVariantsQuantity.forEach((addVariantQuantity) => {
      addVariantQuantity.addEventListener("change", (event) => {
        event.preventDefault();
        const min =
          addVariantQuantity.max !== "" && Number(addVariantQuantity.min);
        const max =
          addVariantQuantity.max !== "" && Number(addVariantQuantity.max);
        const val = Number(addVariantQuantity.value);
        if (max && val > max) {
          addVariantQuantity.value = `${max}`;
        } else if (min && val < min) {
          addVariantQuantity.value = `${min}`;
        }
      });
    });
  },
  setupAddToBags: () => {
    const addToBags = document.querySelectorAll(".clayer-add-to-bag");
    addToBags.forEach((addToBag) => {
      addToBag.addEventListener("click", (event) => {
        event.preventDefault();
        let quantity = 1;
        const variantQuantity =
          addToBag.dataset["addToBagQuantityId"] &&
          document.querySelector(`#${addToBag.dataset.addToBagQuantityId}`);
        if (variantQuantity) {
          const val = Number(variantQuantity.value);
          const quantityMax =
            variantQuantity.max !== "" && Number(variantQuantity.max);
          if (quantityMax && val > quantityMax) {
            return false;
          }
          quantity = val;
        }
        let orderPromise = getOrderToken() ? api.getOrder() : api.createOrder();
        orderPromise.then((order) => {
          api
            .createLineItem(
              order.id,
              addToBag.dataset.skuId,
              addToBag.dataset.skuName,
              addToBag.dataset.skuCode,
              addToBag.dataset.skuImageUrl,
              quantity
            )
            .then(() => {
              api.getOrder();
              openShoppingBag();
            })
            .catch((error) => {
              if (!error.errors().empty()) {
                const availabilityMessageContainer = document.querySelector(
                  `#${addToBag.dataset.availabilityMessageContainerId}`
                );
                if (availabilityMessageContainer) {
                  displayUnavailableMessage(availabilityMessageContainer);
                }
              }
            });
        });
      });
    });
  },
  setupShoppingBagToggles: () => {
    const shoppingBagToggles = document.querySelectorAll(
      ".clayer-shopping-bag-toggle"
    );
    shoppingBagToggles.forEach((shoppingBagToggle) => {
      shoppingBagToggle.addEventListener("click", (event) => {
        event.preventDefault();
        toggleShoppingBag();
      });
    });
  },
};
