import { composeStories } from "@storybook/react";
import * as tokenizedInputStories from "@stories/tokenized-input/tokenized-input.stories";
import { checkAccessibility } from "../../../../../../cypress/tests/checkAccessibility";
import { statesData } from "@stories/assets/exampleData";

const composedStories = composeStories(tokenizedInputStories);

const { Default } = composedStories;

describe("GIVEN a Tokenized Input", () => {
  checkAccessibility(composedStories);

  it("should render the Tokenized Input with pre selected items", () => {
    cy.mount(<Default initialSelectedItems={statesData} />);
    cy.findByRole("textbox").should("exist");
    cy.findByTestId("expand-button").should("exist");
  });
  it("should allow adding items by typing and pressing the delimiter", () => {
    cy.mount(<Default />);
    cy.findByRole("textbox").type("Tokio,");
    cy.findByRole("option").should("exist");
  });
  it.skip("should highlihht pills if navigating with arrows", () => {
    // FIXME: option and testid are in the button, not pill wrapper
    cy.mount(<Default initialSelectedItems={["Tokyo", "Delhi", "Shanghai"]} />);
    cy.findByRole("textbox").focus();

    // navigating trough pills with arrows
    cy.realPress("ArrowLeft");
    cy.findAllByRole("option").eq(2).should("have.class", "saltInputPill-pillHighlighted");
    cy.realPress("ArrowLeft");
    cy.realPress("ArrowRight");
    cy.findAllByRole("option").eq(1).should("have.class", "saltInputPill-pillHighlighted");

  });
  it("should be able to change delimiter", () => {
    cy.mount(<Default delimiter={";"}/>);
    cy.findByRole("textbox").type("Tokio, Delhi, Shanghai");
    cy.findAllByRole("option").should("have.length", 0);
    cy.findByRole("textbox").type("{selectall}{backspace}");
    cy.findByRole("textbox").type("Tokio; Delhi; Shanghai;");
    cy.findAllByRole("option").should("have.length", 3);
  });
  it("should be able to take an array of delimiters", () => {
    cy.mount(<Default delimiter={[";", "/","."]}/>);
    cy.findByRole("textbox").type("Tokio, Delhi, Shanghai");
    cy.findAllByRole("option").should("have.length", 0);
    cy.findByRole("textbox").type("{selectall}{backspace}");
    cy.findByRole("textbox").type("Tokio; Delhi/ Shanghai.");
    cy.findAllByRole("option").should("have.length", 3);
  });
  it("should allow removing items by clicking on the close button", () => {
    cy.mount(<Default initialSelectedItems={["Tokyo"]} />);
    cy.findByRole("textbox").should("exist");
    cy.findByRole("textbox").focus();
    // Clear button should exist
    cy.findByRole("option").should("exist");

    // Remove the item
    cy.realPress("ArrowLeft");
    cy.realPress("Backspace");

    // clear button should not exist after removal
    cy.findByRole("option").should("not.exist");
  });

  it("should clear input on clicking the clear button", () => {
    cy.mount(<Default initialSelectedItems={["Tokyo"]} />);
    cy.findByRole("textbox").focus();
    cy.findByTestId("clear-button").click();
    cy.findByRole("textbox").should("have.value", "");
  });
  it("should expand on clicking the expand button and collapse when blur", () => {
    cy.mount(<Default initialSelectedItems={statesData} />);
    cy.findByRole("textbox").focus();
    cy.findAllByRole("option").should("have.length", 50);
    cy.get('[data-testid="pill"]').eq(49).should("be.visible");
    // Move focus out of Tokenized input
    cy.realPress("Tab");
    cy.realPress("Tab");

    cy.findByRole("textbox").should("not.be.focused");
    cy.get('[data-testid="pill"]').should("have.length", 50);
    cy.findAllByTestId("pill").eq(49).should("not.be.visible");
  });
  it("should not display the clear button if there is no selection", () => {
    cy.mount(<Default />);
    cy.findByTestId("clear-button").should("not.exist");
  });
  it("should return focus to input if an item is closed", () => {
    cy.mount(<Default initialSelectedItems={["Tokyo"]} />);
    cy.findByRole("textbox").focus();
    // move focus to clear button
    cy.findByTestId("clear-button").focus();
    cy.findByTestId("clear-button").realPress("Enter");
    cy.findByRole("textbox").should("have.focus");
  });
  it("should call onChange, onClear, onExpand and onCollapse when actions are prompted", () => {
    // could do with a better description
    const onChangeSpy = cy.spy().as("onChange");
    const onClearSpy = cy.spy().as("onClear");
    const onExpandSpy = cy.spy().as("onExpand");
    const onCollapseSpy = cy.spy().as("onCollapse");
    cy.mount(<Default initialSelectedItems={statesData} onChange={onChangeSpy} onClear={onClearSpy} onExpand={onExpandSpy} onCollapse={onCollapseSpy}/>);
    // expand
    cy.findByTestId("expand-button").click();
    // Move focus out of Tokenized input
    cy.realPress("Tab");
    cy.realPress("Tab");
    //clear input
    cy.findByRole("textbox").focus();
    cy.findByTestId("clear-button").click();
    // type and add an item
    cy.findByRole("textbox").type("Tokio,");

    cy.get("@onExpand").should("have.been.called");
    cy.get("@onChange").should("have.been.called");
    cy.get("@onClear").should("have.been.called");


  })
});